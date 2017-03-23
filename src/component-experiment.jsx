import React, {PropTypes} from "react";
import {enroll} from "./enroll";

class ComponentExperiment {
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

  get() {
    const {expInstance, defaultComponent, id, goals, handleConversion} = this.props;
    const invalidComponent = <div>Invalid Experiment</div>;

    const passprops = {};
    // iterate over goals
    goals.forEach((val, key) => {
      passprops[key] = this.innerPartial(handleConversion, val, id);
    });

    const component = this.getComponentInstance(
        expInstance ? enroll(expInstance, this.props) :
        defaultComponent, passprops);


    return component ?
      component :
      (this.getComponentInstance(defaultComponent) || invalidComponent);
  }


  getComponentInstance(componentName, props = {}) {
    const {components} = this.props;
    if (components && components[componentName]) {
      const comp = React.cloneElement(components[componentName], props);
      return comp;
    }
    return null;
  }

}

ComponentExperiment.propTypes = {
  id: PropTypes.string,
  components: PropTypes.objectOf(PropTypes.element),
  defaultComponent: PropTypes.string,
  name: PropTypes.string.isRequired,
  goals: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleConversion: PropTypes.func.isRequired
};

export default ComponentExperiment;
