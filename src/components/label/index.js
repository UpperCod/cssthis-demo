import css from "./style.this.css";
import { h } from "preact";
import { style } from "cssthis";

let Layout = style("div")(css);

export default function(props) {
    return (
        <Layout container>
            <Layout title>{props.title}</Layout>
            <Layout content>{props.children}</Layout>
        </Layout>
    );
}
