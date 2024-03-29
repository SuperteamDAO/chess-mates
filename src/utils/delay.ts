const delay = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export { delay };
