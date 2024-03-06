## About

A beautiful pathfinding visualizer that is bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

It is designed to work with any city listed on [`OpenStreetMap`](https://www.openstreetmap.org/).

![](https://github.com/JaedonSpurlock01/routify/blob/main/demo.gif)

## How it works

This project uses ThreeJS for rendering the maps

The city data is fetched by the [`Overpass API`](http://overpass-turbo.eu/) offered through OpenStreetMap. The API is free, but it is rate limited and its good to avoid heavy use of external APIs. Therefore, we are caching cities and storing it with Amazon S3.

We use [`Nominatim`](https://nominatim.openstreetmap.org/) for city search querying. When a user clicks a result, we use that id to search in the cache if it exists. If it doesn't then we fallback to the Overpass API.

## Development & Installation

```
1. clone the repository
2. run "npm install"
3. run "npm run dev"
4. open the browser given by the CLI
```

## Limitations

Routify can handle large cities up to 200MB, which can include San Diego, Seattle, Columbus, etc. However, once you start to download larger cities, it will begin to get very laggy. We are downloading millions of lines after all.

## Algorithms Used

A\* Search <br/>
Greedy Search <br/>
Breadth-Firth-Search <br/>
Depth-First-Search (Very Slow) <br/>

## Inspiration

This project is heavily inspired by the three following sources, please go to them and take a look at their projects as well.

[`Python Rendered Pathfinding Visualizer`](https://youtu.be/CgW0HPHqFE8?si=BFFg43Q4frz7BKm6) <br/>
[`City Pathfinding Visualizer`](https://github.com/honzaap/Pathfinding) by https://github.com/honzaap<br/>
[`City Roads`](https://github.com/anvaka/city-roads) by https://github.com/anvaka<br/>

## License

The source code is licensed under MIT license
