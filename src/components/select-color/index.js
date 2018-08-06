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
                        name={props.name || "select-color"}
                    />
                    <div style={`background:${option}`} />
                </Layout>
            ))}
        </Layout>
    );
}
