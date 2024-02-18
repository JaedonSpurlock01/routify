import parseLineData from "@/lib/services/parsing";
import React, { useState, useContext } from "react";
import { IoIosSearch } from "react-icons/io";
import { RotatingLines, ProgressBar } from "react-loader-spinner";
import jsonData from "@/lib/testing/test-cities/san-diego.json";

import { ThreeContext } from "@/lib/context/three.context";
import request from "@/lib/services/request";
import encodeMap from "@/lib/caching/encode";
import decodeMap from "@/lib/caching/decode";

export const CitySearch = ({ setMapIsReady, setCity }) => {
  const [enteredInput, setEnteredInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestionsLoaded, setSuggestionsLoaded] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState("");
  const [sendingRequest, setSendingRequest] = useState(false);
  const { setParsedLineData } = useContext(ThreeContext);

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

    setParsedLineData(parseLineData(jsonData));
    setMapIsReady(true);
    setSendingRequest(false);

    return;

    encodeMap(
      suggestion.name,
      new Date().toDateString(),
      suggestion.osm_id,
      parsedLineData
    ).then((byteData) => {
      decodeMap(byteData).then((decoded) => {
        setParsedLineData(decoded.linesList);
        setSendingRequest(false);
      });
    });

    request(suggestion)
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
      <h1 className="text-center text-3xl text-neutral-200 mb-2 sm:text-6xl">
        Routify
      </h1>
      <h2 className="mb-5 sm:mb-10 text-neutral-500 text-center pl-2 pr-2 text-xs sm:text-lg">
        Your ultimate source for pathfinding algorithms in any city.
      </h2>
      {sendingRequest && (
        <div className="flex flex-col items-center justify-center">
          <ProgressBar width={50} borderColor="white" barColor="#e8c497" />
          <p className="text-neutral-200">
            Currently loading {selectedSuggestion}
          </p>
        </div>
      )}
      {!sendingRequest && (
        <form onSubmit={onSubmit} className="relative">
          <input
            placeholder="Enter a city"
            value={enteredInput}
            onChange={(e) => setEnteredInput(e.target.value)}
            type="text"
            className="rounded-lg p-3 pl-5 pr-10 text-neutral-800 text-xs sm:text-sm focus:outline-none mb-4"
          />
          {!loading && (
            <a
              href="#"
              onClick={onSubmit}
              type="submit"
              className="absolute right-5 top-1/2 transform -translate-y-4 bg-white"
            >
              <IoIosSearch />
            </a>
          )}

          {loading && (
            <div className="absolute right-5 top-1/2 transform -translate-y-4 bg-white">
              <RotatingLines
                visible={true}
                height="18"
                width="18"
                strokeColor="grey"
                strokeWidth="5"
                animationDuration="0.75"
              />
            </div>
          )}
        </form>
      )}

      {!loading && !sendingRequest && (
        <div>
          {suggestionsLoaded && suggestions.length > 0 && (
            <div>
              <ul className="w-[15rem] text-neutral-200 text-xs bg-neutral-800 p-2 flex flex-col rounded-lg overflow-hidden overflow-y-auto max-h-72">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="mb-2 hover:bg-neutral-900 rounded-lg p-1 hover:cursor-pointer"
                    onClick={() => pickSuggestion(suggestion)}
                  >
                    <span>{suggestion.display_name}</span>
                    <br />
                    <small className="text-rose-500">({suggestion.type})</small>
                  </li>
                ))}
              </ul>
            </div>
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
