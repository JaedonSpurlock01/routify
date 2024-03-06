import React, { useState, useContext, useMemo, useEffect } from "react";

import { ThreeContext } from "@/lib/context/three.context";

import { Progress } from "./Progress";
import { SearchBox } from "./SearchBox";
import { Suggestions } from "./Suggestions";
import { Hero } from "./Hero";
import sendRequest from "@/lib/services/request";
import parseLineData from "@/lib/services/parsing";

export const CitySearch = ({ setMapIsReady, setCity }) => {
  const [enteredInput, setEnteredInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestionsLoaded, setSuggestionsLoaded] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState("");
  const [sendingRequest, setSendingRequest] = useState(false);
  const [bytesLoaded, setBytesLoaded] = useState(0);
  const [percentageComplete, setPercentageComplete] = useState(0);
  const [connecting, setConnecting] = useState(true);
  const [cancel, setCancel] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [noRoads, setNoRoads] = useState(false);
  const { setParsedLineData } = useContext(ThreeContext);

  const EventEmitter = require("events");
  const cancelEvent = useMemo(() => new EventEmitter(), [EventEmitter]);

  useEffect(() => {
    if (!cancel) return;
    cancelEvent.emit("cancel");
    setCancel(false);
    setSendingRequest(false);
    setConnecting(true);
    setLoadError(false);
  }, [cancelEvent, cancel]);

  const updateProgress = (event) => {
    if (event.lengthComputable) {
      setBytesLoaded(event.loaded);
      setPercentageComplete(event.loaded / event.total);
      console.log(event.loaded / event.total);
      console.log((event.loaded / event.total) * 100);
    } else {
      setBytesLoaded(event.loaded);
      setPercentageComplete(-1);
    }
    setConnecting(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (enteredInput === "") return;

    setLoading(true);

    // IN THE FUTURE, CHECK IF THE NAME HAS BEEN CHECKED BEFORE (CACHING) TO LOWER STRESS ON API CALLS

    try {
      // Send nominatium API request
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${enteredInput}`
      );

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const suggestions = await response.json();

      const mappedSuggestions = suggestions.map((current_city) => ({
        name: current_city.name,
        display_name: current_city.display_name,
        type: current_city.type,
        osm_id: current_city.osm_id,
        osm_type: current_city.osm_type,
        boundingbox: current_city.boundingbox,
      }));

      setSuggestions(mappedSuggestions);
      setSuggestionsLoaded(true);
    } catch (error) {
      console.log("Could not send request: ", error);
    } finally {
      setLoading(false);
    }
  };

  const pickSuggestion = async (suggestion) => {
    if (sendingRequest === true) return;
    setSendingRequest(true);
    setSelectedSuggestion(suggestion.display_name);
    setCity(suggestion.name);
    setLoadError(false);
    setNoRoads(false);

    try {
      // Check if its in the cache, if so fetch it, otherwise use Overpass API
      const response = await fetch("/api/fetch", {
        method: "POST",
        body: JSON.stringify({ suggestion }),
      });

      const responseData = await response.json();

      // Is not in cache, use fallback
      if (responseData.response && responseData.response === "no-cache") {
        sendRequest(suggestion, updateProgress, cancelEvent)
          .then((response) => {
            const linesList = parseLineData(response, suggestion.boundingbox);
            setParsedLineData(linesList);
            setMapIsReady(true);

            fetch("/api/save", {
              method: "POST",
              body: JSON.stringify({
                name: suggestion.name,
                date: Date(),
                osm_id: suggestion.osm_id,
                linesList,
              }),
            });
          })
          .catch((error) => {
            // If cannot read elements, then 99% likely no roads exist
            setNoRoads(true);
          })
          .finally(() => {
            setSendingRequest(false);
            setLoadError(false);
          });
      } else if (!responseData.linesList) {
        setSendingRequest(false);
        setConnecting(true);
        setLoadError(true);
      } else {
        // Fetched data from cache
        setParsedLineData(responseData.linesList);
        setLoadError(false);
        setMapIsReady(true);
        setSendingRequest(false);
        setCity(responseData.name);
      }

      setSuggestions([]);
      setSuggestionsLoaded(false);
    } catch (error) {
      console.log("Error in pickSuggestion:", error);
      setLoadError(true);
      setSendingRequest(false);
      setConnecting(true);
    }
  };

  return (
    <div className="items-center flex flex-col mb-20">
      <Hero />
      {sendingRequest && (
        <Progress
          name={selectedSuggestion}
          bytesLoaded={bytesLoaded}
          percentage={percentageComplete}
          loading={connecting}
          setCancel={setCancel}
        />
      )}

      {!sendingRequest && (
        <SearchBox
          onSubmit={onSubmit}
          enteredInput={enteredInput}
          setEnteredInput={setEnteredInput}
          loading={loading}
        />
      )}

      {loadError && (
        <div className="text-xs text-rose-500">
          Could not load city. Either try again or try a new city.
        </div>
      )}

      {!loading && !sendingRequest && (
        <div>
          {suggestionsLoaded && suggestions.length > 0 && (
            <Suggestions
              suggestions={suggestions}
              pickSuggestion={pickSuggestion}
            />
          )}
          {suggestionsLoaded && suggestions.length === 0 && (
            <div className="text-xs text-rose-500">
              Could not find matching cities. Try a different city?
            </div>
          )}
          {noRoads && (
            <div className="text-xs text-rose-500">
              Could not find any roads. Try a different query?
            </div>
          )}
        </div>
      )}
    </div>
  );
};
