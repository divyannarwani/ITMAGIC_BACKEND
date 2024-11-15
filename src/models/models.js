import mongoose, {Schema} from "mongoose";

const homePageLogoSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        logo: {
            type: String, // CLOUDINARY URL
            required: true,
        }
    },
    {
        timestamps: true
    }
)

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String, 
            required: true
        }
    },
    {
        timestamps: true
    }
);

const clientageCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
);

const clientSchema = new mongoose.Schema(
    {
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ClientageCategory',
            required: true
        },
        image: {
            type: String, // Store the image path or URL as a string
            required: true
        },
        name: {
            type: String,
            required: true,
            maxlength: 100
        }
    },
    {
        timestamps: true
    }
);

const popupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            default: "name",
            maxlength: 100
        },
        description: {
            type: String,
            default: ''
        },
        image: {
            type: String, // Store the image path or URL as a string
            required: true,
            default: '',
        },
        price: {
            type: Number,
            required: true,
            default: 100
        }
    },
    {
        timestamps: true
    }
);


export const Logo = mongoose.model("Logo", homePageLogoSchema);
export const Product = mongoose.model('Product', productSchema);
export const ClientageCategory = mongoose.model('ClientageCategory', clientageCategorySchema);
export const Client = mongoose.model('Client', clientSchema);
export const Popup = mongoose.model('Popup', popupSchema);