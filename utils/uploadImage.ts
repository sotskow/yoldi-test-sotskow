export const uploadImage = async (fileData: any) => {
    return await (
        await fetch('https://frontend-test-api.yoldi.agency/api/image', {
            method: 'POST',
            body: fileData,
        })
    ).json()
}
