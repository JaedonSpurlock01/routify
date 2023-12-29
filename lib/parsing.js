import jsonData from "/test-cities/san-diego.json";

const parseLineData = () => {
  let returnArray = [];
  let scale = 1;

  jsonData["elements"].forEach((obj) => {
    const currentList = obj["geometry"];

    for (let i = 0; i < currentList.length - 1; i++) {
      const start = [currentList[i].lon * scale, currentList[i].lat * scale];
      const end = [
        currentList[i + 1].lon * scale,
        currentList[i + 1].lat * scale,
      ];

      returnArray.push({ start, end });
    }
  });

  return {
    lineArray: returnArray,
  };
};

export default parseLineData;
