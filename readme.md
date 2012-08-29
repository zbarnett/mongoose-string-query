## Overview
If you use Mongoose to help serve results for API calls, you might be used to handling calls like:

    /monsters?color=purple&eats_humans=true

mongoose-api-query handles some of that busywork for you. Pass in a vanilla object (e.g. req.query) and it'll return a `Mongoose.Query` that you can further chain onto or call `.exec`. Query conditions will be cast to their appropriate types according to your Mongoose schema; e.g. eats_humans=true to a Boolean.

Supports nested properties like `friends.name=` and operators including `{gt}` `{gte}` `{lt}` `{lte}` `{all}`

## Examples

`t`, `y`, and `1` are all aliases for `true`:

    /monsters?eats_humans=y&scary=1

Match on a nested property:

    /monsters?foods.name=kale

Comma-separated values assumes `{any}`:

    /monsters?foods.name=kale,beets

Match only if all are true:

    /monsters?foods.name={all}kale,beets

Numeric operators:

    /monsters?monster_id={gte}30&age={lt}50

## To run tests

```shell
node load_fixtures.js
node app.js
mocha
```