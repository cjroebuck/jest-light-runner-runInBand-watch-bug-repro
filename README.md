This repo reproduces the **Your test suite must contain at least one test** error on subsequent test runs with jest-light-runner when run with --watch and --runInBand options.

To reproduce:

1. `npm install`

2. `npm run test:notworking`

3. tests should run and pass the first time. now make a change and save, or press Enter to trigger a new test run.

4. should receive the following error:

```bash   
    FAIL  src/__tests__/bar.js
  ● Test suite failed to run

    Your test suite must contain at least one test.

      at onResult (node_modules/@jest/core/build/TestScheduler.js:172:18)
          at async Promise.all (index 0)
```

I have tracked down the issue to this line https://github.com/nicolo-ribaudo/jest-light-runner/blob/main/src/worker-runner.js#L99

It seems that when run with `--runInBand`, the dynamic import when using `InBandPiscina` class is cached on subsequent test runs, and jest-circus fails to pick up the tests. 

A hacky fix I made for this is to stick a random hash on the end of the import file path as a query parameter to 'bust' the import module cache, i.e.:

  `await import(pathToFileURL(testFile));`

  becomes

  `await import(pathToFileURL(testFile)+"?"+Date.now());`

This works, but feels quite hacky and would probably lead to memory leaks if used in watch mode for many hours.

