interface Props {
  link?: string;
  text: string;
  color: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

function ActionButton(props:Props) {
  const onClick = props.onClick != undefined ? props.onClick : () => {};

  let className = "shadow-md h-14 flex text-center text-l font-work-sans rounded-xl border-b-4";

  switch(props.color) {
    case "primary":
      className += " bg-indigo-600 border-indigo-700 text-white";
      break;
    case "secondary":
      className += " border-t-2 border-x-2 bg-white border-gray-300 text-blue-400";
      break;
    case "gray":
      className += " border-t-2 border-x-2 bg-gray-100 border-gray-200 text-gray-300 pointer-events-none";
      break;
    case "green":
      className += " bg-green-600 border-green-700 text-white pointer-events-none";
      break;
    case "red":
      className += " bg-red-600 border-red-700 text-white pointer-events-none";
      break;
    default:
      className += " bg-indigo-600 border-indigo-700 text-white";
      break;
  }
   
  return (
    <a className={className} href={props.link} onClick={onClick}>
      <span className="align-middle m-auto">{props.text}</span>
    </a>
  )
}

export default ActionButton
