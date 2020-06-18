Part of udemy course "MERN Stack Front To Back" by Brad Traversy. This is a fully functional project, coded along with course. 

-- config:
dependency added to manage global variables

-- On deleting profile, delete user and posts too. Its okay if comments aren't deleted.

-- Added to package.json in client:
"proxy": "http://localhost:7000"

-- Set body to 100vh, landing to 90vh to prevent scrolling

-- how we have access to "dispatch" in components and actions?
Ans) Using react-redux and redux-thunk
Here, 'connect'ed = react component that uses connect function of react-redux
Magic of react-redux:
If we use an action-creator in any 'connect'ed component, say 'setAlert' in Register component
It actually means a wrapper function of same name that wraps the action-creator
{ setAlert: dispatch(setAlert(...args)) }, and this wrapper is available to component as props.setAlert.
When props.setAlert is executed, it actually executes/dispatches the action-creator to the store i.e.
dispatch(setAlert(...args)) and from store with latest state to the reducer.

Refer this first link completely to understand (why we arrive at) second link:
(read about "bindActionCreators" to understand shorthand object syntax of mapDispatchToProps)
https://react-redux.js.org/7.1/using-react-redux/connect-mapdispatch#two-forms-of-mapdispatchtoprops
https://react-redux.js.org/7.1/using-react-redux/connect-mapdispatch#defining-mapdispatchtoprops-as-an-object

Magic of redux-thunk:
Then in action file like /actions/alert.js, we have 'dispatch' because
Refer: https://github.com/reduxjs/redux-thunk#composition
When this function (here, setAlert action-creator) is passed to `dispatch` (when setAlert wrapper dispatches
setAlert action-creator i.e. dispatch(setAlert(...args))), 
the thunk middleware will intercept it, and call it with `dispatch` and `getState` as arguments.
This gives the thunk function the ability to run some logic, and still interact with the store.
Note: 
In the code for setAlert and removeAlert, no async work is being done.
We don't need thunk to deal with synchronous code.
So we may skip the dispatch and just return the action object like shown in removeAlert.
In the 'connect'ed component, these action-creators will be dispatched to store 
as part of mapDispatchToProps object form in 'connect' by react-reducer 

However, if we do use redux-thunk, the thunk middleware intercepts our dispatch to the 
store and calls it with `dispatch` and `getState` as arguments.
That is why we have dispatch available in the returned function as arguments here in actions.
This gives the thunk function the ability to run some logic, and still interact with the store.
It still works fine! (Tried and tested.)

Lecture 82 React Front to Back See Q&A section.
Context with a reducer is much  the same as redux.
I think the confusion here is the inclusion of thunk and react-redux.
Normally in redux you would dispatch actions (plain objects with a type and payload) with store.dispatch({type, payload}).
And with action creators in react-redux we would have a plain function that returns an object of {type, payload} and through react-redux's connect function it is dispatched. Essentially react-redux's connect with mapDispatchToProps dispatches the object/action for us.
The problem with that is how do you manage an asynchronous action?
That's why we bring in thunk, and we return a function instead of an object from our action creators. That function takes a dispatch as an argument so that we choose when to dispatch the created action, which will be after we have done our async data fetching.
All that thunk does is check to see if what comes back from the action creator is a function or a object.
If it's an object it dispatches it as normal.
If it's a function, it calls that function for us passing store.dispatch as the argument.
At a higher level you can think of it like...
Oh I see you gave me a function..
functionYouGaveThunk(store.dispatch)
So we control when the action is dispatched.
There are a lot of moving parts to the redux ecosystem, redux, react-redux, thunk, but on it's own redux is fairly straight forward. It does take a lot of time with it to 'get' it but it is worth it.
I hope that helps and doesn't confuse you further.


-- Note:
mongoose-unique-validator dependency has been added to project and in models/User.js
But not used because response pattern was different. 
Pattern in project: json({ errors: [{ msg: 'User already exists!'}] })
Would have to use: json({ errors: [{ msg: error.errors.email.properties.message }] });
Instead, manually checked if user exists in routes/users.js

-- Note:
In AdvanceCabBooking, user is not automatically logged in on sign-up.
On first page load, we see 401 Unauth error in dev console. Normal i think.
