'use strict'

const handle = async (ctx, content, opts) => {
    try {
        ctx.body = await ctx.headlessChrome.screenshot(content, opts)
        ctx.type = 'image/png'
    } catch (e) {
        ctx.status = 500
        ctx.body = {
            code: 500,
            errors: e.stack,
            message: e.message
        }
    }
}

exports.get = async ctx => {
    const { content, ...opts } = ctx.query
    await handle(ctx, content, opts)
}

exports.post = async ctx => {
    const { content, ...opts } = ctx.request.body
    await handle(ctx, content, opts)
}