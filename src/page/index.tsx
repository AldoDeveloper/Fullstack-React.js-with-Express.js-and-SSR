import React from "react";

export default function PageIndex() : React.ReactNode{
    const [count, setCount]  = React.useState<number>(0);
    return(
        <React.Fragment>
            <div className="container">
                <p className="text-center" style={{marginBottom: "30px", fontSize: "2rem", width: "500px"}}>Fullstack ReactJs, <a href="/api">Api</a> ,ExpressJs with SSR</p>
                <div className="flex" style={{marginBottom: "28px"}}>
                    <img src="/vite.svg" className="animated-image" width={80} alt="" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" className="animated-image" width={80} alt="" />
                </div>
                <div className="flex">
                    <div>
                        <button onClick={async() => setCount(count + 1)}>{count}</button>
                        <p className="text-center" style={{marginTop: "10px"}}>Count</p>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}