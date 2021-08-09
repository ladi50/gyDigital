const request = require("request");
const Domain = require("../models/domain");

exports.saveFakeDomains = async (req, res) => {
    const { domain } = req.body;

    let domains = [];

    try {
        const foundDomain = await Domain.findOne({ name: domain });
        if (foundDomain) {
            return res.status(200).json("Domain already exists in DB.");
        }

        const options = {
            url: `https://otx.alienvault.com/otxapi/indicators/?type=domain&include_inactive=0&sort=-modified&q=${domain}&limit=9999999`,
            headers: {
                "Content-Type": "application/json"
            }
        };

        const callback = async (err, httpResponse, body) => {
            const parsedBody = JSON.parse(body);
            const results = parsedBody.results;

            for (const item of results) {
                if (item.indicator !== domain) {
                    await domains.push(item.indicator);
                }
            }

            const dom = new Domain({
                name: domain,
                fake: domains
            });

            await dom.save();
        };

        await request.get(options, callback);
    } catch (err) {
        return res.status(500).json(err.stack);
    }

    res.status(201).json("Saved domain and fake domains to DB.");
};

exports.deleteDomain = async (req, res) => {
    const { domain } = req.params;

    try {
        const foundDomain = await Domain.findOne({ name: domain });
        if (!foundDomain) {
            return res.status(404).json("Domain not found");
        }

        await Domain.findOneAndDelete({ name: domain });
    } catch (err) {
        return res.status(500).json(err.stack);
    }

    res.status(200).json("Domain removed successfully!");
};

exports.deleteDomains = async (req, res) => {
    try {
        const foundDomains = await Domain.find();
        if (foundDomains.length === 0) {
            return res.status(404).json("Domains not found");
        }

        await Domain.deleteMany({});
    } catch (err) {
        return res.status(500).json(err.stack);
    }

    res.status(200).json("Domains removed successfully!");
};