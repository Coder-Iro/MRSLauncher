<template>
  <div id="frameBar">
    <div id="frameResizableTop" class="frameDragPadder"></div>
    <div id="frameMain">
      <div class="frameResizableVert frameDragPadder"></div>
      <div v-if="isDarwin" id="frameContentDarwin">
        <div id="frameButtonDockDarwin">
          <button
            id="frameButtonDarwin_close"
            class="frameButtonDarwin fCb"
            tabIndex="-1"
          ></button>
          <button
            id="frameButtonDarwin_minimize"
            class="frameButtonDarwin fMb"
            tabIndex="-1"
          ></button>
          <button
            id="frameButtonDarwin_restoredown"
            class="frameButtonDarwin fRb"
            tabIndex="-1"
          ></button>
        </div>
      </div>
      <div v-else id="frameContentWin">
        <div id="frameTitleDock">
          <span id="frameTitleText">MRS Launcher</span>
        </div>
        <div id="frameButtonDockWin">
          <button
            id="frameButton_minimize"
            class="frameButton fMb"
            tabIndex="-1"
          >
            <svg
              height="10"
              name="TitleBarMinimize"
              viewBox="0 0 12 12"
              width="10"
            >
              <rect
                fill="#ffffff"
                height="1"
                stroke="#ffffff"
                width="10"
                x="1"
                y="6"
              ></rect>
            </svg>
          </button>
          <button
            id="frameButton_restoredown"
            class="frameButton fRb"
            tabIndex="-1"
          >
            <svg
              height="10"
              name="TitleBarMaximize"
              viewBox="0 0 12 12"
              width="10"
            >
              <rect
                fill="none"
                height="9"
                stroke="#ffffff"
                stroke-width="1.4px"
                width="9"
                x="1.5"
                y="1.5"
              ></rect>
            </svg>
          </button>
          <button id="frameButton_close" class="frameButton fCb" tabIndex="-1">
            <svg
              height="10"
              name="TitleBarClose"
              viewBox="0 0 12 12"
              width="10"
            >
              <polygon
                fill="#ffffff"
                fill-rule="evenodd"
                points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583 1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1"
                stroke="#ffffff"
              ></polygon>
            </svg>
          </button>
        </div>
      </div>
      <div class="frameResizableVert frameDragPadder"></div>
    </div>
  </div>
  <router-view />
</template>

<style lang="css">
body {
  transition: background-image 1s ease;
  background-image: url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD//gA+Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2ODApLCBkZWZhdWx0IHF1YWxpdHkK/9sAQwAIBgYHBgUIBwcHCQkICgwUDQwLCwwZEhMPFB0aHx4dGhwcICQuJyAiLCMcHCg3KSwwMTQ0NB8nOT04MjwuMzQy/9sAQwEJCQkMCwwYDQ0YMiEcITIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy/8AAEQgAPwBwAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A8VooopDCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/9k=");
  background-size: cover;
  -webkit-user-select: none;
}

#main {
  display: none;
  height: calc(100% - 22px);
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.75) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  width: 100%;
  position: absolute;
  z-index: 10;
}

#main[overlay] {
  filter: blur(3px) contrast(0.9) brightness(1);
}
</style>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  components: {},
  setup() {
    const isDarwin = process.platform === "darwin";
    return {
      isDarwin
    };
  }
});
</script>

<style scoped src="./assets/css/launcher.css" />
