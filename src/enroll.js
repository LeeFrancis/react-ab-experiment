export const enroll = (expInst, props) => {
  const { provider, name, prepend, user = {id: 0}} = props;
  const inst = {
    "optimizely": () => {
      const val = expInst.activate(
        name,
        `${user.id || 0}`
      );
      return `${prepend || ""}${val}`;
    },
    "planout": () => expInst.get(name)
  };
  return inst[provider](expInst, name);
};
