## Overview
If you use Mongoose to help serve results for API calls, you might be used to handling calls like:

    /monsters/v1?color=purple&eats_humans=true

mongoose-api-query handles some of that busywork for you. Pass in a vanilla object (e.g. req.query) and it'll return a `Mongoose.Query` that you can further chain onto or call `.exec`. Query conditions will be cast to their appropriate types according to your Mongoose schema; e.g. eats_humans=true to a Boolean.

Supports nested properties like `friends.name=` and operators including `{gt}` `{gte}` `{lt}` `{lte}` `{all}` and `{near}`

## Examples

`t`, `y`, and `1` are all aliases for `true`:

    /monsters/v1?eats_humans=y&scary=1

Match on a nested property:

    /monsters/v1?foods.name=kale

Comma-separated values assumes `{any}`:

    /monsters/v1?foods.name=kale,beets

Match only if all are true:

    /monsters/v1?foods.name={all}kale,beets

Numeric operators:

    /monsters/v1?monster_id={gte}30&age={lt}50

geo near, with (optional) radius in miles:

    /monsters/v1?{near}latlon=38.8977,-77.0366&radius=10

if `page` param is passed in, that translates to `skip` with default limit of 100.

    /monsters/v1?page=2

## Usage

Apply the plugin to any schema in the usual Mongoose fashion:

    monsterSchema.plugin(mongooseApiQuery);

Then call it like you would using `Model.find`. This returns a Mongoose.Query:

    Monster.apiQuery(req.query).exec(...

Or pass a callback in and it will run `.exec` for you:

    Monster.apiQuery(req.query, function(err, monsters){...

## To run tests

```shell
node load_fixtures.js
node app.js
mocha
```

## License

MIT http://mit-license.org/
