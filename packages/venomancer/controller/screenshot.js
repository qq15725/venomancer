'use strict'

const handle = async (ctx, content, opts) => {
    ctx.type = 'image/png'
    ctx.body = await ctx.headlessChrome.screenshot(content, opts)
}

exports.get = async ctx => {
    const { content, ...opts } = ctx.query
    await handle(ctx, content, opts)
}

exports.post = async ctx => {
    const { content, ...opts } = ctx.request.body
    await handle(ctx, content, opts)
}