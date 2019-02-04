module.exports = {
    "extends": "airbnb-base",
    rules: {
        "nonblock-statement-body-position": ["error", "below"],
        "no-prototype-builtins": "off",
        "indent": ["error", 2, { "SwitchCase": 1 } ],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "single"],
        "semi": ["error", "never"],
        "no-unused-vars": ["error", { "args": "none" }],
        "no-console": "off",
        "global-require": "off",
        "import/no-dynamic-require": "off",
        "no-underscore-dangle": "off"
    },
    "globals":{
        "describe":true,
        "it":true,
        "beforeAll": true,
        "beforeEach": true,
        "expect": true
    }
};