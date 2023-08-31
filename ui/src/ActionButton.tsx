function ActionButton(props) {
  return (
    <a className="text-center text-xl font-work-sans" href={props.link}>{props.text}</a>
  )
}

export default ActionButton
