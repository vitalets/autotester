module.exports = function FlagsNote() {
  return (
    <div className="flags-note">
      To remove warning <b>Autotester is debugging this browser</b> please
      enable <a href="chrome://flags#silent-debugger-extension-api">silent-debugger-extension-api</a> flag.
    </div>
  );
};

/*
 `[extensions-on-chrome-urls](chrome://flags#extensions-on-chrome-urls) - to allow testing other chrome extensions`,
 */
