import React, {PropTypes} from "react";
import {enroll} from "./enroll";

class PropertyExperiment {
  constructor(props) {
    this.props = props;
    this.provider = {props};
  }


  /* Grab all children - this can deal with multiple children or a single child
   */
  get() {
    const {children, propKey, expInstance } = this.props;
    if (!expInstance) {
      return children;
    }
    const clonedChildren = [];
    const arrayChildren = typeof children === "object" ? [children] : children;
    const experimentVal = enroll(expInstance, this.props);
    for (const child of arrayChildren) {
      const extendedProp = {};
      extendedProp[propKey] = experimentVal;
      clonedChildren.push(React.cloneElement(
        child, extendedProp
      ));
    }
    return clonedChildren.length === 1 ? clonedChildren[0] : clonedChildren;
  }

}

PropertyExperiment.propTypes = {
  name: PropTypes.string.isRequired,
  propKey: PropTypes.string
};


export default PropertyExperiment;
