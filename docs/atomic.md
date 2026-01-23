## Design pattern
RewardzAi uses [atomic design](http://atomicdesign.bradfrost.com/) based on Brad Frost design pattern proposition.

#### Base priciples:
`Atoms` are UI elements that can’t be broken down any further and serve as the elemental building blocks of an interface.\
`Molecules` are collections of atoms that form relatively simple UI components.\
`Organisms` are relatively complex components that form discrete sections of an interface.\
`Templates` place components within a layout and demonstrate the design’s underlying content structure.\
`Pages` apply real content to templates and articulate variations to demonstrate the final UI and test the resilience of the design system.

#### Create new component:
While adding more time to develop a component, please complete all the below steps when you are creating a new component.
1. Add in the right folder based on the atomic design principles.
2. Every logic should be outsourced into a hook. Please check also if there isn't already a hook that fits your needs.
3. Create a test suite for the component.
4. Create a story for the component with all possible variations (knobs, actions, etc)
5. Every component should have a JSDoc description with a link to it's story file (@see [target])

#### Tips:
 - When using atomic design to build new components, personally, usually it's better to start from an atom component, if it's getting complex I move it hierarchically.
 - Do not use global css rules, always use css modules in order to not affect other components
 - Order components based on roles (external modules first -> export defaults -> modules imports -> assets)

[Go back to main README.md ](../README.md)
