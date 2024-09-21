import React from 'react';
import Data from './data.jsx';

export default () => <div> <ul> { Data.map( task => <li> {task.task} </li>)}</ul></div>;
