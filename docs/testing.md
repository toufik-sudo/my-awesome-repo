## Unit testing
RewardzAi uses a combination of jest, enzyme and react-testing-library to test functionality.
While jest + enzyme is used to shallow test a component, react-testing-library is used to fully test changes at DOM level.

### Add new test:
- Create a new file in the right folder based on Atomic design pattern (Example.test.tsx)
- Add a render test (if too complex use shallow). Usually this is enough to get 100% coverage
- (optional) If the component has logic, fireEvents, test dom changes

#### Tips:
- If the component has a lot of childrens with compelx logic (context, hooks), shallow testing can be used. (better if this can be avoided)
\
[Go back to main README.md ](../README.md) 