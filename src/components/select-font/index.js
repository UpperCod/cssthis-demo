import css from "./style.this.css";
import { h } from "preact";
import { style } from "cssthis";

let Layout = style("div")(css);

export default function(props) {
    return (
        <Layout container>
            {props.options.map((option, index) => (
                <Layout tag="label">
                    <input
                        type="radio"
                        onchange={() =>
                            props.onchange && props.onchange(option, index)
                        }
                        name={props.name || "select-font"}
                    />
                    <div>
                        <span style={`font-family:${option}`}>{option}</span>
                    </div>
                </Layout>
            ))}
        </Layout>
    );
}
