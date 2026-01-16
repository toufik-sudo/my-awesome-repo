# rewardzai frontend

React + typescript front-end application for rewardzai

### Installation

Make sure you have installed [Node.js](https://nodejs.org/en/) (preffered 10 LTS or above).

Clone project + git hooks:
```bash
git clone git@gitlab.pitechplus.com:rewardzai/rewardzai-frontend.git
cd rewardzai-frontend
cp .env.dist .env
cp .githooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
cp .githooks/pre-push .git/hooks/pre-push
chmod +x .git/hooks/pre-push
```

All below commands are executed inside `frontend` folder!

To install all dependencies: 
```bash
npm install
```

### Usage

For local development: (default port 3000)
```bash
npm start
```

To test locally with coverage report:
```bash
npm run test --coverage
```

Integration tests:
```bash
npm run test:e2e
```

#### Lint
Project uses eslint + prettier.

Lint check: (locally you can use `:fix` to automatically fix all errors/warnings)
```bash
   npm run eslint
```

NOTE: If you use VSCode, you can opt for lint on save. Check [here](https://github.com/prettier/prettier-vscode) for more info.


## Storybook
rewardzai uses storybook to keep components documented and easy to maintain.
Please before creating a new component, check if there isn't already one suited for your needs.

#### How to use
Storybook will run on a separate local server on port `9009` and it can be opened with: `npm run storybook`\
NOTE: Sometimes when changing files storybook does not automatically refresh, so please refresh manually in order to see the changes.


#### New story
If no components matches your requirements please follow the below instructions to create a new story:
1. In `src/components/stories`, match based on atomic design your folder and create a new file `yourcomponent.stories.tsx`.
2. If the components requires extra providers use the `<StoryWrapper>` component
3. Render the component with all the properties and please read [Knobs documentation](https://www.npmjs.com/package/@storybook/addon-knobs)
to match the property with the right knob.
4. After creating the story, pleae go to the rendered component file and use Jsdoc line `@res YourComponentStory`
5. Check if the story is rendered correctly and all properties are displayed correctly

#### FAQ

Q: what if my component requires redux store, react router or react intl inside?\
A: You can wrap your component with `<StoryWrapper>` that provides all required providers.

Q: My main application keeps showing an error of an incorrect import\
A: When applying a change on a story file, does not reflect on main app also. You need to make a change to rendered component to force refresh hot reloader.
