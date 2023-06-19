import NavigationBar from "./NavigationBar.tsx";

export default function Header(props: { title: string; active: string }) {
  const isHome = props.active == "/";
  return (
    <div class="pb-16">
      <NavigationBar active={props.active} blogTitle={props.title} />
    </div>
  );
}
