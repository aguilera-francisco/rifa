const app = Vue.createApp({
    data() {
        return {
            rows: 50,
            cols: 2,
            records: [],
        };
    },
    computed: {
        rowsArray() {
            return Array.from({ length: this.rows }, (_, i) => i + 1);
        },
        colsArray() {
            return Array.from({ length: this.cols }, (_, i) => i + 1);
        },
        sortedRecords() {
            return this.records.sort(
                (a, b) => a.fields.Número - b.fields.Número
            );
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
                    // if (!response.ok) {
                    //     throw new Error(
                    //         `HTTP error! status: ${response.status}`
                    //     );
                    // }else{

                    // }
                    return response.json();
                })
                .then((data) => {
                    this.records = data.records;
                    console.log(this.records);
                })
                .catch((error) => {
                    this.fetchError = error;
                    console.error("Error fetching data:", error);
                });
        },
        getRecord(row, col) {
            const index = (row - 1) * this.cols + (col - 1);
            const record = this.sortedRecords[index];
            return record ? record.fields.Name || "" : "";
        },
    },
    created() {
        this.fetchData();
    },
});

app.component("table-component", {
    template: `
        <table>
            <tbody>
                <tr v-for="row in rowsArray" : key="row">
                    <td v-for="col in colsArray" :key="col" :class="getCellClass(row, col)" >
                        {{ getCellContent(row, col) }}
                    </td>
                </tr>
            </tbody>
        </table>
    `,
    props: ["rowsArray", "colsArray"],
    data() {
        return {
            count: 1,
        };
    },
    methods: {
        getCount(row, col) {
            return (row - 1) * this.colsArray.length + col;
        },
        getCellContent(row, col) {
            const cellNumber = (row - 1) * this.colsArray.length + col;
            const recordName = this.$root.getRecord(row, col);
            return `${cellNumber}${recordName ? " .- " + recordName : ".-"}`;
        },
        getCellClass(row, col) {
            const recordName = this.$root.getRecord(row, col);
            return recordName ? "has-name" : "no-name";
        },
    },
});

app.mount("#myApp");
