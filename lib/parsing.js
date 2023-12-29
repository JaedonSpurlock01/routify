import jsonData from "/test-cities/san-diego.json";

const parseLineData = () => {
  let returnArray = [];
  let total = 0;
  let sumX = 0;
  let sumY = 0;
  let scale = 1;

  jsonData["elements"].forEach((obj) => {
    const currentList = obj["geometry"];
    total += currentList.length;

    for (let i = 0; i < currentList.length - 1; i++) {
      const start = [currentList[i].lon * scale, currentList[i].lat * scale];
      const end = [
        currentList[i + 1].lon * scale,
        currentList[i + 1].lat * scale,
        0,
      ];

      sumX += currentList[i].lon * scale;
      sumY += currentList[i].lat * scale;

      returnArray.push({ start, end });
    }

    sumX += currentList[currentList.length - 1].lon * scale;
    sumY += currentList[currentList.length - 1].lat * scale;
  });

  return {
    centerX: sumX / total,
    centerY: sumY / total,
    lineArray: returnArray,
  };
};

export default parseLineData;
