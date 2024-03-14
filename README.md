## About

A pathfinding visualizer designed to work with any city listed on [`OpenStreetMap`](https://www.openstreetmap.org/).

<br/>

![](https://github.com/JaedonSpurlock01/routify/blob/main/demo.gif)

## How it works

This project uses ThreeJS for rendering the maps

The city data is fetched by the [`Overpass API`](http://overpass-turbo.eu/) offered through OpenStreetMap. The API is free, but it is rate limited and its good to avoid heavy use of external APIs. Therefore, we are caching cities and storing it with Amazon S3.

We use [`Nominatim`](https://nominatim.openstreetmap.org/) for city search querying. When a user clicks a result, we use that id to search in the cache if it exists. If it doesn't then we fallback to the Overpass API.

For plotting lines, we are using the mercator projection based on the Earth's radius. In addition, to help tie with user experience, there is also reverse geocoded points based on placed points.

## Development & Installation

Create an Amazon S3 and IAM account and create access/secret keys. Put those keys in a .env.local file as NEXT_ACCESS_KEY and NEXT_SECRET_KEY. Afterwards, run the following build commands.

```
NEXT_ACCESS_KEY = 12345
NEXT_SECRET_KEY = 67890
```

```
1. run "npm install"
2. run "npm run dev"
```

## Deployment

This website uses Vercel to deploy the website. It is very easy to use and this website follows the basic setup process with their platform.

## Limitations

Routify can handle large cities up to 100MB, which can include San Diego, Seattle, Columbus, etc. However, once you start to download larger cities, the website will start to get very memory intensive and will slow down. We are downloading millions of lines after all.<br/>

The biggest city I was able to load is Chongqing, China (70mb), which consumes up 1gb of memory.

## Algorithms Used

A\* Search <br/>
Greedy Search <br/>
Dijkstra's Search <br/>
Breadth-Firth-Search <br/>
Bidirectional Weighted Search <br />
Bidirectional Unweighted Search <br />
Depth-First-Search (Very Slow) <br/>

## Inspiration

This project is heavily inspired by the three following sources, please go to them and take a look at their projects as well.

[`Python Rendered Pathfinding Visualizer`](https://youtu.be/CgW0HPHqFE8?si=BFFg43Q4frz7BKm6) <br/>
[`City Pathfinding Visualizer`](https://github.com/honzaap/Pathfinding) by https://github.com/honzaap<br/>
[`City Roads`](https://github.com/anvaka/city-roads) by https://github.com/anvaka<br/>

## License

The source code is licensed under MIT license
