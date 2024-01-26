import parseLineData from "@/lib/parsing";
import React, { useState, useRef, useContext } from "react";
import { IoIosSearch } from "react-icons/io";
import { RotatingLines } from "react-loader-spinner";

import jsonData from "@/lib/test-cities/san-diego.json";
import { ThreeContext } from "@/lib/context/three.context";

export const CitySearch = ({ setMapIsReady }) => {
  const [enteredInput, setEnteredInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestionsLoaded, setSuggestionsLoaded] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
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
    // By convention the area id can be calculated from an existing
    // OSM way by adding 2400000000 to its OSM id, or in case of a
    // relation by adding 3600000000 respectively.

    // Remove later, used for testing //
    let parsedLineData = parseLineData(jsonData);
    setParsedLineData(parsedLineData);
    setMapIsReady(true);
    return;
    ////////////////////////////////////

    let areaId;

    if (suggestion.osm_type === "relation") {
      areaId = suggestion.osm_id + 36e8;
    } else if (suggestion.osm_type === "way") {
      areaId = suggestion.osm_id + 24e8;
    }

    // Different types of filtering out lines
    // prettier-ignore
    const roadStrict = '[highway~"^(((motorway|trunk|primary|secondary|tertiary)(_link)?)|unclassified|residential|living_street|pedestrian|service|track)$"][area!=yes]';

    // prettier-ignore
    const roadBasic = '[highway~"^(motorway|primary|secondary|tertiary)|residential"]';
    const road = "[highway]";
    const building = "[building]";
    const allWays = "";

    const wayFilter = roadStrict;
    const timeout = 900;
    const maxHeapSize = 1073741824;
    const responseType = "geom";

    // OverpassQL query to filter and extract roads from Overpass API
    const queryString = `[timeout:${timeout}][maxsize:${maxHeapSize}][out:json];area(3600253832);(._; )->.area;(way${wayFilter}(area.area););out ${responseType};`;

    /*
    / KARTI, HERE IS WHERE YOU WILL SEND THE OVERPASS API REQUEST, THE SKELETON OF THE REQUEST IS IN THE GOOGLE DOC, USE THE QUERY STRING ABOVE
    /
    / BEFORE SENDING THE REQUEST, PLEASE CHECK THE DATABASE FIRST TO SEE IF THE AREA_ID ALREADY EXISTS IN THERE
    /
    / IF IT IS NOT IN THE DATABASE, SEND THE API REQUEST, THEN CALL ParseLineData(API_RESPONSE.json), THEN ADD THE RETURN ARRAY FROM THAT FUNCTION INTO THE DATABASE
    / USING THE APPROPIATE SCHEMA BELOW,
    /
    / NAME: suggestion.name
    / DISPLAY_NAME: suggestion.display_name
    / AREAID: areaId
    / BOUNDING_BOX: suggestion.boundingbox
    / OSMTYPE: suggestion.osm_type 
    / OSMID: suggestion.osm_id
    / LINES: parsed_line_data   <- put the returned value from ParseLineData(json) here, you do not need to modify ParseLineData
    */

    setParsedLineData([] /* Set the parsed_line_data here */);
    setMapIsReady(true);
  };

  return (
    <div className="items-center flex flex-col mb-20">
      <h1 className="text-center text-3xl text-neutral-200 mb-2 sm:text-6xl">
        Routify
      </h1>
      <h2 className="mb-5 sm:mb-10 text-neutral-500 text-center pl-2 pr-2 text-xs sm:text-lg">
        Your ultimate source for pathfinding algorithms in any city.
      </h2>
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

      {!loading && (
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
                    <a href="#" onClick={() => pickSuggestion(suggestion)}>
                      <span>{suggestion.display_name}</span>
                      <br />
                      <small className="text-rose-500">
                        ({suggestion.type})
                      </small>
                    </a>
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
