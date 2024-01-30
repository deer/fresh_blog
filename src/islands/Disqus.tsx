// credit to https://github.com/haikelfazzani/portfolio for this code

import { Comment } from "../components/DiscussionEmbed.tsx";

type DisqusProp = {
  title: string;
  identifier: string;
  shortname: string;
};

export default function Disqus({ title, identifier, shortname }: DisqusProp) {
  return (
    <div class="w-100 mt-2">
      <Comment
        title={title}
        identifier={identifier.toLowerCase().replace(/\s+/g, "-")}
        url={`http://localhost:8000/blog/${identifier}`}
        shortname={shortname}
      />
    </div>
  );
}
