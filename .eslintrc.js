module.exports = {
    "extends": "@finanzchef24gmbh/eslint-config-fc24",
    "plugins": [
        "standard",
        "promise"
    ],
    "env": {
        "node": true,
        "mocha": true
    },
    "rules": {
        "strict": [2, "never"],
        "no-unused-expressions": 0
    }
};