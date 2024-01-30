// deno-lint-ignore-file
import { useEffect } from "preact/hooks";

const DISQUS_INSTANCE: any = "DISQUS";
const DISQUS_CONFIG: any = "disqus_config";
const DISQUS_SHORTNAME: any = "disqus_shortname";
const DISQUS_THREAD: any = "disqus_thread";
const DISQUS_COMMENT_ELEMENT_ID: any = "dsq-embed-scr";
const DISQUS_PRELOAD_IFRAME_SELECTOR: any = "iframe[id^=dsq-app]";

const DEFER_LOADING_MS = 4000;

export interface DisqusCommentProps {
  title: string;
  identifier: string;
  url: string;
  shortname: string;

  defer?: number; // defer loading (ms)
}

const EMPTY_DISQUS_CONFIG: any = {
  identifier: "",
  url: "",
  shortname: "",
  defer: DEFER_LOADING_MS,
};

export function Comment(props: any) {
  const disqusConfig = Object.assign({}, EMPTY_DISQUS_CONFIG, props);

  const insertScript = (src: any, id: any, parentElement: any) => {
    const script = document.createElement("script");
    script.async = true;
    script.src = src;
    script.id = id;
    parentElement.appendChild(script);
    return script;
  };

  const removeScript = (id: any, parentElement: any) => {
    const script = document.getElementById(id);
    if (script) {
      parentElement.removeChild(script);
    }
  };

  const removeDisqusThreadElement = () => {
    const disqusThread = document.getElementById(DISQUS_THREAD);
    if (disqusThread) {
      while (disqusThread.hasChildNodes()) {
        disqusThread.firstChild &&
          disqusThread.removeChild(disqusThread.firstChild);
      }
    }
  };

  const removeDisqusPreloadFrameElement = () => {
    const disqusPreloadFrame = document.querySelectorAll(
      DISQUS_PRELOAD_IFRAME_SELECTOR,
    );

    if (disqusPreloadFrame) {
      disqusPreloadFrame.forEach((value, key, parent) => {
        value.parentElement?.removeChild(value);
      });
    }
  };

  const getDisqusConfig = () => {
    return function (this: any) {
      this.page.identifier = disqusConfig.identifier;
      this.page.url = disqusConfig.url;
      this.page.title = props.title;
    };
  };

  const loadInstance = () => {
    setTimeout(() => {
      if (
        window[DISQUS_INSTANCE] &&
        document.getElementById(DISQUS_COMMENT_ELEMENT_ID)
      ) {
        (window[DISQUS_INSTANCE] as any).reset({
          reload: true,
          config: getDisqusConfig(),
        });
      } else {
        removeDisqusThreadElement();
        if (props.shortname) {
          (window[DISQUS_CONFIG] as any) = getDisqusConfig();
          window[DISQUS_SHORTNAME] = disqusConfig.shortname;
          insertScript(
            `https://${disqusConfig.shortname}.disqus.com/embed.js`,
            DISQUS_COMMENT_ELEMENT_ID,
            document.body,
          );
        }
      }
    }, disqusConfig.defer);
  };

  const cleanInstance = () => {
    removeScript(DISQUS_COMMENT_ELEMENT_ID, document.body);
    if (window[DISQUS_INSTANCE]) {
      (window[DISQUS_INSTANCE] as any).reset();
      (window[DISQUS_INSTANCE] as any) = undefined;
      removeDisqusThreadElement();
      removeDisqusPreloadFrameElement();
    }
  };

  useEffect(() => {
    loadInstance();
    return cleanInstance;
  }, [props.identifier]);

  return <div id={DISQUS_THREAD} />;
}
