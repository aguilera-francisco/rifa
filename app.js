const app = Vue.createApp({
    data() {
        return {
            records: [],
            fetchError: null,
        };
    },
    computed: {
        availableNumbers() {
            // Filtra los registros que no tienen nombre y ordena por número
            const availableArr = this.records
                .filter((record) => !record.fields.Name)
                .map((record) => record.fields.Number)
                .sort((a, b) => a - b);
            return availableArr;
        },
        rowsArray() {
            // Divide los números en filas de 4 columnas
            const rows = [];
            for (let i = 0; i < this.availableNumbers.length; i += 4) {
                rows.push(this.availableNumbers.slice(i, i + 4));
            }

            return rows;
        },
    },
    methods: {
        fetchData() {
            fetch(
                "https://api.airtable.com/v0/appaB7lE8uBU4KgX5/tbld9TuBQag6R6wFx",
                {
                    headers: {
                        Authorization:
                            "Bearer patrE9OGTiBQUrEp1.c2b64587e1d2f2d01c8708866070e5785f48fe69097d7ed1d0e78c1d1dcb0cda",
                        "Content-Type": "application/json",
                    },
                }
            )
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            `HTTP error! status: ${response.status}`
                        );
                    }
                    return response.json();
                })
                .then((data) => {
                    this.records = data.records;
                })
                .catch((error) => {
                    this.fetchError = error;
                    console.error("Error fetching data:", error);
                });
        },
    },
    created() {
        this.fetchData();
    },
});

app.component("table-component", {
    template: `
        <div>
            <div v-if="$root.fetchError" class="error">
                Error fetching data: {{$root.fetchError.message}}
            </div>
            <table class="striped">
                <tbody>
                    <tr v-for="(row, rowIndex) in rowsArray" :key="rowIndex" >
                        <td v-for="(col, colIndex) in row" :key="colIndex" >
                        {{ col }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,
    props: ["records"],
    computed: {
        rowsArray() {
            return this.$root.rowsArray;
        },
    },
});

app.mount("#app");
