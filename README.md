# TwitterCravingP5
Visualizing tweets containing the word "craving" in P5. *Work in progress - super alpha alpha draft.*

**Progress:**

Dec 2 - Experiment in P5 only. Currently still using small dataset (<200 rows) scraped from Twitter and cleaned & imported to .CSV. The original CSV file is 34.9MB and contains 53,459 rows.

**To Do List:**

1. Integrate with NodeJS, figure out a way to 'stream' large CSV files. There are 2 options that I could think of:
	- Use csv to json node packages to 'stream' the data being sent to P5, for example: [csvtojson](https://www.npmjs.com/package/csvtojson), [csv-parse](http://csv.adaltas.com/parse/examples/), or [PapaParse](https://github.com/mholt/PapaParse).
	- Move all of my .CSV to a Parse database and 'stream' chunks of data continuosly to feed the visualization.

2. Add filtering interface. Figure out a way to search the tweet-archive based on specific food term, and display it in P5. 

