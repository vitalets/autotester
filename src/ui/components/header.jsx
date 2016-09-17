
module.exports = () => {
    return <header className="mdl-layout__header">

        <div className="mdl-layout__header-row">

            <span style={{marginRight: '8px'}} className="mdl-layout-title">Tests:</span>

            <div style={{margin: '0 8px'}} className="mdl-textfield mdl-js-textfield getmdl-select">

                <input className="mdl-textfield__input" value="Belarus" type="text" id="country" readOnly={true} tabIndex="-1"
                       data-val="BLR"/>

                <label htmlFor="country">
                    <i style={{color: 'white'}} className="mdl-icon-toggle__label material-icons">keyboard_arrow_down</i>
                </label>

                <ul className="mdl-menu mdl-menu--bottom-left mdl-js-menu" htmlFor="country">
                    <li className="mdl-menu__item" data-val="BLR">Belarus</li>
                    <li className="mdl-menu__item" data-val="RUS">Russia</li>
                </ul>
            </div>


            <button id="run"
                    className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                <span>Run</span>
            </button>
            {/*
            <div className="mdl-layout-spacer"></div>

            <span style={{marginRight: '5px'}} className="mdl-layout-title">Target:</span>

            <div style={{marginRight: '0 8px'}} className="mdl-textfield mdl-js-textfield getmdl-select">
                <input className="mdl-textfield__input" value="Belarus" type="text" id="country2" readonly tabIndex="-1"
                       data-val="BLR"/>

                <label for="country2">
                    <i style="color: white" className="mdl-icon-toggle__label material-icons">keyboard_arrow_down</i>
                </label>

                <ul className="mdl-menu mdl-menu--bottom-left mdl-js-menu" for="country2">
                    <li className="mdl-menu__item" data-val="BLR">Belarus</li>
                    <li className="mdl-menu__item" data-val="RUS">Russia</li>
                </ul>
            </div>
*/}

        </div>


    </header>
};
