

export function errorHandle(err, req, res, next) {

    console.log(err?.code);

    if(err?.code.indexOf("CSRFTOKEN") !== -1){
        return res.status(301).redirect(`/?error=${err?.message}`)
    }

    return res.status(500).json({
        type: "server error",
        message: err?.message,
        code: 500
    })
}