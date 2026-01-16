## Storybook
RewardzAi uses storybook to keep components documented and easier to maintain.
Please before creating a new component, check if there isn't already one that can be customised.

#### How to use:
Storybook will run on a separate local server on port `9009` and it can be opened with: `npm run storybook`\
NOTE: Sometimes when changing files storybook does not automatically refresh, so please refresh manually in order to see the changes.

#### Create new story:
If no components matches your requirements please follow the below instructions to create a new story:
1. In `src/components/stories`, match based on atomic design your folder and create a new file `yourcomponent.stories.tsx`.
2. If the components requires extra providers use the `<StoryWrapper>` component
3. Render the component with all the properties and please read [Knobs documentation](https://www.npmjs.com/package/@storybook/addon-knobs)
to match the property with the right knob.
4. After creating the story, pleae go to the rendered component file and use Jsdoc line `@res YourComponentStory`
5. Check if the story is rendered correctly and all properties are displayed correctly

#### FAQ:

Q: what if my component requires redux store, react router or react intl inside?\
A: You can wrap your component with `<StoryWrapper>` that provides all required providers.

Q: My main application keeps showing an error of an incorrect import\
A: When applying a change on a story file, does not reflect on main app also. You need to make a change to rendered component to force refresh hot reloader.

#### Notes:
Few components might have wrong design if there is an external css applied. So it is recommended to use CSS Modules in order
to have the correct design for each story.\
\
[Go back to main README.md ](../README.md) 