import parseLineData from "@/lib/services/parsing";
import React, { useState, useContext, useMemo, useEffect } from "react";

import { ThreeContext } from "@/lib/context/three.context";
import request from "@/lib/services/request";

import { Progress } from "./Progress";
import { SearchBox } from "./SearchBox";
import { Suggestions } from "./Suggestions";
import { Hero } from "./Hero";

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
  const { setParsedLineData } = useContext(ThreeContext);

  const EventEmitter = require("events");
  const cancelEvent = useMemo(() => new EventEmitter(), [EventEmitter]);

  useEffect(() => {
    if (!cancel) return;
    cancelEvent.emit("cancel");
    setCancel(false);
    setSendingRequest(false);
    setLoading(false);
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

  const pickSuggestion = (suggestion) => {
    if (sendingRequest === true) return;
    setSendingRequest(true);
    setSelectedSuggestion(suggestion.display_name);
    setCity(suggestion.name);

    request(suggestion, updateProgress, cancelEvent)
      .then((response) => {
        setParsedLineData(parseLineData(response));
        setMapIsReady(true);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setSuggestions([]);
        setSuggestionsLoaded(false);
        setSendingRequest(false);
      });
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
          {/* {noRoads && (
            <div>Could not find any roads. Try a different query?</div>
          )} */}
        </div>
      )}
    </div>
  );
};
