import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import CategoryMenu from '../components/navigation/CategoryMenu.tsx'

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/CategoryMenu">
                <CategoryMenu/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews