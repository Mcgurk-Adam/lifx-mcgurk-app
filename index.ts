const urlSearchParams = new URLSearchParams(window.location.search);
let authToken:string|null = null;
if (urlSearchParams.has("auth-token")) {
    authToken = urlSearchParams.get("auth-token");
    localStorage.setItem("auth-token", authToken);
} else {
    const retrievedToken = localStorage.getItem("auth-token");
    if (retrievedToken) {
        authToken = retrievedToken;
    }
}

if (authToken != null) {
    window.history.pushState({}, "", "/");
    (async () => {
        const appScreen = document.getElementById("app");
        appScreen.style.display = "flex";
        const refreshedState = await refreshState();
        const groupElement = document.querySelector(".group-section").cloneNode(true) as HTMLElement;
        for (const group of refreshedState) {
            const groupElementClone = groupElement.cloneNode(true) as HTMLElement;
            groupElementClone.style.display = "block";
            // @ts-ignore
            groupElementClone.querySelector(".group-switch [data-name]").innerText = group.name;
            const groupCheckbox:HTMLInputElement = groupElementClone.querySelector(".group-switch input[type=checkbox]");
            groupCheckbox.checked = group.on;
            groupCheckbox.onchange = async (e) => {
                const newPowerState = groupCheckbox.checked ? "on" : "off";
                await changeState(buildSelector("group", group.id), newPowerState);
            }
            appScreen.insertAdjacentElement("beforeend", groupElementClone);
        }
        document.querySelector(".group-section").remove();
    })();
} else {
    // redirect to auth page
}

async function http(path: string, method:"GET"|"POST"|"PUT" = "GET", data:string|null = null): Promise<any> {
    const authToken = localStorage.getItem("auth-token");
    const baseUrl = "https://api.lifx.com/v1";
    const fetchOptions:RequestInit = {
        method: method,
        headers: {
            "Authorization": `Bearer ${authToken}`,
        },
        body: data,
    };
    try {
        const fetchRequest = await fetch(baseUrl + path, fetchOptions);
        return await fetchRequest.json();
    } catch (e) {
        // do something with an http error here
    }
}

async function changeState(selector:string, powerStatus:"on"|"off") {
    console.log(selector, powerStatus);
    const httpReturn = await http(`/lights/${selector}/state`, "PUT", JSON.stringify({
        "power": powerStatus,
        "brightness": powerStatus === "on" ? 1.0 : 0.0,
        "duration": 0.0,
    }));
    console.log(httpReturn);
}

async function refreshState(): Promise<Group[]> {
    const lights = await http("/lights/all") as any[];
    document.getElementById("locationTitle").innerText = lights[0]?.location.name;
    const lightGroups:Group[] = [];
    for (const light of lights) {
        const lightObject:Light = {
            id: light.id,
            uuid: light.uuid,
            name: light.label,
            power: light.power,
            connected: light.connected,
            groupId: light?.group.id,
        };
        let group:Group;
        const foundGroup = lightGroups.find(group => group.id === light.group.id);
        if (foundGroup == undefined) {
            group = {
                id: light.group.id,
                name: light.group.name,
                lights: [lightObject],
                on: light.power === "on",
            };
            lightGroups.push(group);
        } else {
            if (light.power === "on") {
                foundGroup.on = true;
            }
            foundGroup.lights.push(lightObject);
        }
    }
    return lightGroups;
}

function buildSelector(type:"light"|"group", id:string):string {
    return type === "light" ? `id:${id}` : `group_id:${id}`;
}

interface Light {
    id: string;
    uuid: string;
    power: "on"|"off";
    connected: boolean;
    groupId: string;
    name: string;
}

interface Group {
    id: string;
    name: string;
    on: boolean;
    lights: Light[];
}