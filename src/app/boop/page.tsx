import { prisma } from "../../../prisma";

const Bop = async () => {

    const data = await prisma.bravo.findMany()
    console.log(data)
    return (
        <>
            <p>Bop</p>
            <div>
                {data.map((d) => (
                    <div key={d.id}>
                        <p>{d.id}</p>
                        <p>{d.message}</p>
                    </div>
                ))}
            </div>

        </>
    );
};

export default Bop;