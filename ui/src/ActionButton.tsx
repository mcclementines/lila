interface Props {
  link: string;
  text: string;
  color: string;
}

function ActionButton(props:Props) {
  let className = "shadow-md h-14 flex text-center text-xl font-work-sans rounded-xl border-b-4";

  switch(props.color) {
    case "primary":
      className += " bg-indigo-600 border-indigo-700 text-white";
      break;
    case "secondary":
      className += " border-t-2 border-x-2 bg-white border-gray-300 text-blue-400";
      break;
    default:
      className += " bg-indigo-600 border-indigo-700 text-white";
      break;
  }
   
  return (
    <a className={className} href={props.link}>
      <span className="align-middle m-auto">{props.text}</span>
    </a>
  )
}

export default ActionButton
