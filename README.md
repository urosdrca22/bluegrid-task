## Setup Instructions

Follow these steps to set up and run the project locally:

### 1. Clone the repository
### 2. Install dependencies and run the start script

```shell
npm install
npm start
```
### 3. (Optional) - wait for 10-15 seconds for data to be prefetched before testing. You should see the following message in the console shortly after spinning up the server:
'Data pre-fetched and cached successfully.'
### 4. Test by visiting http://localhost:3000/api/files in the browser or through CLI with curl 
`curl http://localhost:3000/api/files`


## Project overview

- Node.js (express) server fetching data from the provided url and performing the neccessary transformations to achieve the required format
- Due to the tree like structure of the output, transformation is done recursively
- Delay when fetching data from the external API is overcome by caching the result 
- When caching was initially implemented, there was still an issue of delay on the first request before the data is cached - this is solved by implementing a prefetch mechanic that fetches data immediately on server startup.
- Caching is implemented in-memory just as a proof of concept. In a real world scenario a more robust caching solution would be used, using more persistent cache as well as a mechanic to refresh data periodically according to how frequently it is expected to change

