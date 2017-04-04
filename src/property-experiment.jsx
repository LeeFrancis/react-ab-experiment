import React, {PropTypes} from "react";
import {enroll} from "./enroll";

class PropertyExperiment {
  constructor(props) {
    this.props = props;
    this.provider = {props};
  }

  innerPartial(func) {
    const args = Array.prototype.slice.call(arguments).splice(1);
    return () => {
      const allArguments = args.concat(Array.prototype.slice.call(arguments));
      return func.apply(this, allArguments);
    };
  }

  /* Grab all children - this can deal with multiple children or a single child
   */
  get() {
    const {children, propKey, expInstance, id, goals, handleConversion } = this.props;
    if (!expInstance) {
      return children;
    }
    const clonedChildren = [];
    const goalProps = {};
    // iterate over goals
    //for (const prop in goals) {
    for (const key of goals.keys()) {  
      goalProps[key] = this.innerPartial(handleConversion, goals.get(key), id);
    }
    const arrayChildren = typeof children === "object" ? [children] : children;
    const experimentVal = enroll(expInstance, this.props);
    for (const child of arrayChildren) {
      const extendedProp = {};
      extendedProp[propKey] = experimentVal;
      clonedChildren.push(React.cloneElement(
        child, Object.assign({}, extendedProp, goalProps)
      ));
    }
    return clonedChildren.length === 1 ? clonedChildren[0] : clonedChildren;
  }

}

PropertyExperiment.propTypes = {
  name: PropTypes.string.isRequired,
  propKey: PropTypes.string,
  id: PropTypes.string,
  goals: PropTypes.object.isRequired,
  handleConversion: PropTypes.func.isRequired
};


export default PropertyExperiment;
