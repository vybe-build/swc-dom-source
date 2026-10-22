export function Excluded() {
  return <button id="excluded">Excluded source file</button>;
}

export function Forwarded(props) {
  return <button {...props} id="forwarded">Caller source</button>;
}
