import css from "./style.this.css";
import { style, Theme } from "cssthis/preact";
import { h, Component } from "preact";
import Hero from "../../components/hero";
import SelectColor from "../../components/select-color";
import SelectFont from "../../components/select-font";
import Label from "../../components/label";
import Button from "../../components/button";
import Logo from "../../components/logo";
import Gear from "../../components/icon-gear";

let Layout = style("div")(css);

export default class extends Component {
    constructor() {
        super();
        this.state = {
            colors: [
                "black",
                "#ED6D15",
                "#EAA711",
                "mediumaquamarine",
                "cornflowerblue"
            ],
            color: "black",
            fontTitle: "Montserrat",
            fontContent: "Montserrat",
            fonts: [
                "Montserrat",
                "Knewave",
                "Indie Flower",
                "Monoton",
                "Nixie One"
            ]
        };
    }
    render(props, state) {
        return (
            <Theme
                primary={state.color}
                fontTitle={state.fontTitle}
                fontContent={state.fontContent}
            >
                <Layout container>
                    <Layout aside aside-hide={state.asideToggle}>
                        <Layout
                            aside-toggle
                            onclick={() =>
                                this.setState({
                                    asideToggle: !state.asideToggle
                                })
                            }
                        >
                            <Gear size="18px" color={state.color} />
                        </Layout>
                        <Layout aside-scroll>
                            <Label title="THEME" />
                            <Label title="background color">
                                <SelectColor
                                    options={state.colors}
                                    onchange={color => this.setState({ color })}
                                />
                            </Label>
                            <Label title="Font title">
                                <SelectFont
                                    options={state.fonts}
                                    name="font-title"
                                    onchange={fontTitle =>
                                        this.setState({ fontTitle })
                                    }
                                />
                            </Label>
                            <Label title="Font content">
                                <SelectFont
                                    options={state.fonts}
                                    name="font-content"
                                    onchange={fontContent =>
                                        this.setState({ fontContent })
                                    }
                                />
                            </Label>
                        </Layout>
                    </Layout>
                    <Layout content>
                        <Hero
                            title={[
                                <Logo color="white" />,
                                <br />,
                                <span>
                                    Create amazing styles for your components
                                    without stopping using css
                                </span>
                            ]}
                            content={[
                                <span>
                                    What you see is an example using
                                    <a href="https://rollupjs.org">Rollup</a>,
                                    <a href="https://github.com/uppercod/cssthis">
                                        Cssthis
                                    </a>
                                    and
                                    <a href="https://preactjs.com">Preact</a>.
                                    The result is extremely light, fast and
                                    customizable
                                </span>,
                                <br />,
                                <br />,
                                <a href="https://github.com/uppercod/cssthis">
                                    <Button>Github cssthis</Button>
                                </a>,
                                <a href="https://github.com/UpperCod/cssthis-demo/tree/gh-pages">
                                    <Button>Github this code</Button>
                                </a>
                            ]}
                        />
                    </Layout>
                </Layout>
            </Theme>
        );
    }
}
