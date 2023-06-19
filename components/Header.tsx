import NavigationBar from "./NavigationBar.tsx";

export default function Header(props: { title: string; active: string }) {
  const isHome = props.active == "/";
  return (
    <div>
      <NavigationBar active={props.active} />
    </div>
  );
}
