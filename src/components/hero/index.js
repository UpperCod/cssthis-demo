import css from "./style.this.css";
import { h } from "preact";
import { style } from "cssthis/preact";

let Layout = style("div")(css);

export default function(props) {
    return (
        <Layout container shadow radius>
            <Layout group>
                <Layout tag="h1">{props.title}</Layout>
                <Layout tag="p">{props.content}</Layout>
            </Layout>
        </Layout>
    );
}
