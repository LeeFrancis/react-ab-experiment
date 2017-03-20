import React from "react";


class ComponentExperiment {
  constructor({provider = "planout"}) {
    this.provider = provider;
  }


  innerPartial(func) {
    const args = Array.prototype.slice.call(arguments).splice(1);
    return () => {
      const allArguments = args.concat(Array.prototype.slice.call(arguments));
      return func.apply(this, allArguments);
    };
  }

  componentExperiment() {
    const {defaultComponent} = this.props;
    const {name, id, goals} = this.props;
    const expInstance = this.getExperimentInstance();
    const invalidComponent = <div>Invalid Experiment</div>;

    const passprops = {};
    // iterate over goals
    goals.forEach((val) => {
      passprops[val] = this.innerPartial(this.handleSuccessEvent, val, id);
    });

    const component = this.getComponentInstance(
        expInstance ? this.experimentGet(expInstance, name, this.provider) :
        defaultComponent, passprops);


    return component ?
      component :
      (this.getComponentInstance(defaultComponent) || invalidComponent);
  }


  getComponentInstance(componentName, props = {}) {
    if (this.components && this.components[componentName]) {
      const comp = React.cloneElement(this.components[componentName], props);
      return comp;
    }
    return null;
  }

}

export default ComponentExperiment;
